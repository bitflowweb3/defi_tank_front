import React from 'react';
import { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

import './notification.scss';
import { useGlobalContext } from 'provider';
import { restApi } from 'provider/restApi';
import { apiNotification } from 'utils/services';

interface NotifiitemProps {
  notifi: NotifiObject
  getNotifications: any
}

const NotifiItem = ({ notifi, getNotifications }: NotifiitemProps) => {
  const [state, { dispatch }] = useGlobalContext();
  const [notifiTime, setNotifiTime] = useState<string>('');

  useEffect(() => {
    try {
      if (!notifi?.created) {
        throw new Error("invalid time format");
      }

      let tempData = new Date(notifi.created);
      let tempStr = tempData.toLocaleDateString();
      setNotifiTime(tempStr.replaceAll('/', ' / '));
    } catch (err) {
      setNotifiTime('');
    }
  }, [notifi])

  const readAlert = async () => {
    try {
      dispatch({ type: "loading", payload: true })
      await restApi.readAlert(notifi._id, state.account)
      await getNotifications()

      dispatch({ type: "loading", payload: false })
    } catch (err) {
      apiNotification(err);
      dispatch({ type: "loading", payload: false })
    }
  }

  return (
    <div className="notifi-item" onClick={readAlert}>
      <div className="notifi-close">
        <CloseIcon />
      </div>

      <div className="notifi-item-title">
        {notifi.title}
      </div>

      <div className="notifi-item-content">
        {notifi.description}
      </div>

      <div className="notifi-item-time">
        {notifiTime}
      </div>
    </div>
  )
}

const Notification = () => {
  const [state, { dispatch }] = useGlobalContext();
  const [notifications, setotifications] = useState<NotifiObject[]>([]);
  const [showNotifi, setshowNotifi] = useState<Boolean>(false);
  const closeNotifi = () => { setshowNotifi(false) };
  const openNotifi = () => { setshowNotifi(true) };

  useEffect(() => {
    getNotifications();
  }, [state.walletStatus])

  const getNotifications = async () => {
    try {
      if (state.walletStatus !== 2) {
        throw new Error("please wallet connect")
      }

      let tempResult = await restApi.getAlert(state.account);
      setotifications(tempResult);
    } catch (err) {
      setotifications([]);
    }
  }

  const readAll = async () => {
    try {
      dispatch({ type: "loading", payload: true });
      for (let i = 0; i < notifications.length; i++) {
        const notifi: NotifiObject = notifications[i];
        await restApi.readAlert(notifi._id, state.account);
      }

      await getNotifications();
      dispatch({ type: "loading", payload: false });
    } catch (err) {
      apiNotification(err);
      dispatch({ type: "loading", payload: false });
    }
  }

  return (
    !!notifications?.length && (
      <div className='notification-wrapper'>
        <div className="alert-badge" onClick={openNotifi}>
          {notifications.length}
        </div>

        <div className={`notifi-cotainer ${!showNotifi && ('notifi-hide')}`}>
          <div className="notifi-overlay" onClick={closeNotifi} />

          <div className="notifi-body">
            <div className='notifi-header'>
              <CloseIcon className='notifi-close' onClick={closeNotifi} />

              <div className='header-title' onClick={readAll}>
                Clear all notifications
              </div>
            </div>

            <div className='notifi-count'>
              Notifications ({notifications.length})
            </div>

            <div className='notifi-items'>
              {notifications.map((notifi: NotifiObject, key: number) => (
                <NotifiItem notifi={notifi} key={key}
                  getNotifications={getNotifications}
                />
              ))}
            </div>
          </div>
        </div>
      </div >
    )
  )
}

export { Notification }