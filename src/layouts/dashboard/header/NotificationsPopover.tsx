import { noCase } from 'change-case';
import { useCallback, useEffect, useState } from 'react';
// @mui
import {
  Box,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  IconButton,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';
// utils
import { fToNow } from '../../../utils/formatTime';
// _mock_
import { _notifications } from '../../../_mock';
// components
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';
import { PATH_DASHBOARD } from 'src/routes/paths';
import axiosInstance from 'src/utils/axios';
import useAuth from 'src/hooks/useAuth';
import { Console } from 'console';
import { format } from 'date-fns';
import axios from 'src/utils/axios';
import { useNavigate } from 'react-router';

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const { user } = useAuth();

  const [count, setCount] = useState(0);

  const navigate = useNavigate();

  const isCustomer = user?.account?.roleName === 'Customer';

  const [notifications, setNotifications] = useState<any>([]);
  let totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

  const fetch = useCallback(async () => {
    try {
      const response: any = await axiosInstance.get(`/api/notifications/get_notifications`, {
        params: { id: user?.account?.id },
      });
      if (response.status === 200) {
        if (response.data.length !== notifications.length) {
          setCount(response.data.length - notifications.length);
          setNotifications(
            response.data.map((e: any) => ({
              id: e.id,
              title: e.object_name,
              description: e.notification_content,
              avatar: '',
              type: e.current_object_id,
              createdAt: new Date(format(new Date(e.created_time), 'HH:mm MM/dd/yyyy')),
              isUnRead: !e.is_read,
            }))
          );
        }
      }
      totalUnRead = notifications.filter((item) => item.isUnRead === true).length;
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const readNotify = useCallback(async (id: string) => {
    try {
      const response = await axios.put(
        '/api/notifications/read_notifications',
        {},
        {
          params: { id: id },
        }
      );
      if (response.status === 200 || response.status === 201) {
        setCount(count - 1);
      }
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [open, setOpen] = useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleClick = (id: string, requestId: string, isUnRead: boolean, type: string) => {
    if (isUnRead === true) {
      readNotify(id);
    }
    if (type === 'RE') {
      if (!isCustomer) {
        navigate(PATH_DASHBOARD.admin.request.edit(requestId));
      } else navigate(PATH_DASHBOARD.customer.request.edit(requestId));
    } else if (type === 'CON') {
      if (!isCustomer) {
        navigate(PATH_DASHBOARD.admin.contract.view(requestId));
      } else navigate(PATH_DASHBOARD.customer.contract.view(requestId));
    } else if (type === 'MS') {
      if (!isCustomer) {
        navigate(PATH_DASHBOARD.admin.maintainSchedule.edit(requestId));
      } else navigate(PATH_DASHBOARD.customer.maintainSchedule.edit(requestId));
    } else if (type === 'MR') {
      if (!isCustomer) {
        navigate(PATH_DASHBOARD.admin.maintainReport.edit(requestId));
      } else navigate(PATH_DASHBOARD.customer.maintainReport.edit(requestId));
    }
  };

  const readAllNotify = useCallback(async () => {
    try {
      const response = await axios.put(
        '/api/notifications/read_all_notifications',
        {},
        {
          params: { user_id: user?.account?.id },
        }
      );
      if (response.status === 200 || response.status === 201) {
        setCount(0);
      }
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMarkAllAsRead = () => {
    readAllNotify();
    // setNotifications(
    //   notifications.map((notification) => ({
    //     ...notification,
    //     isUnRead: false,
    //   }))
    // );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      totalUnRead = notifications.filter((item) => item.isUnRead === true).length;
      fetch();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <IconButtonAnimate
        color={open ? 'primary' : 'default'}
        onClick={handleOpen}
        sx={{ width: 40, height: 40 }}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" width={20} height={20} />
        </Badge>
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{ width: 360, p: 0, mt: 1.5, ml: 0.75 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" width={20} height={20} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                New
              </ListSubheader>
            }
          >
            {notifications.slice(0, 2).map((notification) => (
              <>
                <Box
                  onClick={() =>
                    handleClick(
                      notification.id,
                      notification.type,
                      notification.isUnRead,
                      notification.title
                    )
                  }
                >
                  <NotificationItem key={notification.id} notification={notification} />
                </Box>
              </>
            ))}
          </List>

          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Before that
              </ListSubheader>
            }
          >
            {notifications.slice(2, 5).map((notification) => (
              <>
                <Box
                  onClick={() =>
                    handleClick(
                      notification.id,
                      notification.type,
                      notification.isUnRead,
                      notification.title
                    )
                  }
                >
                  <NotificationItem key={notification.id} notification={notification} />
                </Box>
              </>
            ))}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple>
            View All
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}

// ----------------------------------------------------------------------

type NotificationItemProps = {
  id: string;
  title: string;
  description: string;
  avatar: string | null;
  type: string;
  createdAt: Date;
  isUnRead: boolean;
};

function NotificationItem({ notification }: { notification: NotificationItemProps }) {
  const { avatar, title } = renderContent(notification);

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnRead && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
            {fToNow(notification.createdAt)}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification: NotificationItemProps) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {noCase(notification.description)}
      </Typography>
    </Typography>
  );

  if (notification.type === 'order_placed') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="https://minimal-assets-api-dev.vercel.app/assets/icons/ic_notification_package.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === 'order_shipped') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="https://minimal-assets-api-dev.vercel.app/assets/icons/ic_notification_shipping.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === 'mail') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="https://minimal-assets-api-dev.vercel.app/assets/icons/ic_notification_mail.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === 'chat_message') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="https://minimal-assets-api-dev.vercel.app/assets/icons/ic_notification_chat.svg"
        />
      ),
      title,
    };
  }
  return {
    avatar: notification.avatar ? <img alt={notification.title} src={notification.avatar} /> : null,
    title,
  };
}
