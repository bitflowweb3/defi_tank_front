import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

import './notification.scss'
import { useGlobalContext } from 'provider';
import { restApi } from 'provider/restApi';

export const Notification = () => {
  const [state, { dispatch, updateNofitication }] = useGlobalContext()

  const [showNotifi, setshowNotifi] = useState<Boolean>(false);
  const [notifications, setotifications] = useState<NotifiObject[]>([])

  useEffect(() => {
    setotifications(state.notifications)
  }, [state.notifications])

  const closeNotifi = () => { setshowNotifi(false) }
  const openNotifi = () => { setshowNotifi(true) }

  const readAll = async () => {
    try {
      if (!state.notifications.length) {
        return
      }

      dispatch({
        type: "loading",
        payload: true
      })

      for (let i = 0; i < notifications.length; i++) {
        const notifi: NotifiObject = notifications[i]
        await restApi.readAlert(notifi._id)

      }

      await updateNofitication()

      dispatch({
        type: "loading",
        payload: false
      })
    } catch (err) {
      console.log(err.message)
      dispatch({
        type: "loading",
        payload: false
      })
    }
  }

  return (
    !!notifications?.length && (
      <div className='notification-wrapper ml-5 mr-30'>
        <div className="alert-badge" onClick={openNotifi}>
          {notifications.length}
        </div>

        <div className={`notifi-cotainer ${!showNotifi && ('notifi-hide')}`}>
          <div onClick={closeNotifi}
            className="notifi-overlay"
          />

          <div className="notifi-body">
            <div className='notifi-header'>
              <CloseIcon onClick={closeNotifi}
                className='notifi-close'
              />

              <div onClick={readAll}
                className='header-title'
              >
                Clear all notifications
              </div>
            </div>

            <div className='notifi-count'>
              Notifications ({notifications.length})
            </div>

            <div className='notifi-items'>
              {notifications.map((notifi: NotifiObject, key: number) => (
                <NotifiItem notifi={notifi} key={key} />
              ))}
            </div>
          </div>
        </div>
      </div >
    )
  )
}

const NotifiItem = ({ notifi }: { notifi: NotifiObject }) => {
  const [state, { dispatch, updateNofitication }] = useGlobalContext()

  const readAlert = async () => {
    try {
      dispatch({
        type: "loading",
        payload: true
      })

      await restApi.readAlert(notifi._id)
      await updateNofitication()

      dispatch({
        type: "loading",
        payload: false
      })
    } catch (err) {
      console.log(err.message)
      dispatch({
        type: "loading",
        payload: false
      })
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
        {notifi.content}
      </div>

      <div className="notifi-item-time">
        {notifi.time}
      </div>
    </div>
  )
}