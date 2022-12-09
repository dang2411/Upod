import { createContext, ReactNode, useEffect, useReducer } from 'react';
// utils
import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';
// @types
import localStorage from 'redux-persist/es/storage';
import { ActionMap, AuthState, AuthUser, JWTContextType } from '../@types/auth';

// ----------------------------------------------------------------------

enum Types {
  Initial = 'INITIALIZE',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  Register = 'REGISTER',
}

type JWTAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
    user: AuthUser;
  };
  [Types.Login]: {
    user: AuthUser;
  };
  [Types.Logout]: undefined;
  [Types.Register]: {
    user: AuthUser;
  };
};

export type JWTActions = ActionMap<JWTAuthPayload>[keyof ActionMap<JWTAuthPayload>];

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const JWTReducer = (state: AuthState, action: JWTActions) => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user,
      };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    case 'REGISTER':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };

    default:
      return state;
  }
};

const AuthContext = createContext<JWTContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(JWTReducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = await localStorage.getItem('accessToken');

        if (state.isAuthenticated) {
          return;
        }

        if (accessToken !== null && isValidToken(accessToken)) {
          setSession(accessToken);

          const id = await localStorage.getItem('id');

          const account_id = await localStorage.getItem('account_id');

          const response = await axios.get('/api/accounts/search_accounts_by_id', {
            params: { id: account_id },
          });

          const user = {
            accessToken,
            account: {
              id: id,
              accountId: account_id,
              code: response.data.code,
              username: response.data.username,
              roleId: response.data.role.id,
              roleName: response.data.role.role_name,
            },
          };

          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: Types.Initial,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, [state.isAuthenticated]);

  const login = async (userName: string, password: string) => {
    const response: any = await axios.post('/api/accounts/login', {
      userName,
      password,
    });
    if (response.status !== 200) {
      throw new Error(response.message);
    }

    if (response.data.role_name !== 'Admin' && response.data.role_name !== 'Customer') {
      throw new Error('Permission denied!!!');
    }

    const { id, token, account_id, code, username, role_id, role_name } = response.data;

    const user = {
      accessToken: token,
      account: {
        id: id,
        accountId: account_id,
        code: code,
        username: username,
        roleId: role_id,
        roleName: role_name,
      },
    };

    localStorage.setItem('id', id);
    localStorage.setItem('account_id', account_id);

    setSession(token);

    dispatch({
      type: Types.Login,
      payload: { user },
    });
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const response = await axios.post('/api/account/register', {
      email,
      password,
      firstName,
      lastName,
    });
    const { accessToken, user } = response.data;

    localStorage.setItem('accessToken', accessToken);

    dispatch({
      type: Types.Register,
      payload: {
        user,
      },
    });
  };

  const logout = async () => {
    setSession(null);
    localStorage.removeItem('id');
    localStorage.removeItem('account_id');
    dispatch({ type: Types.Logout });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
