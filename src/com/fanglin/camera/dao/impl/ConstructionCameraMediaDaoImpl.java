package com.fanglin.camera.dao.impl;

import java.sql.Timestamp;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.camera.dao.ConstructionCameraMediaDao;
import com.fanglin.camera.po.ConstructionCameraMediaPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.system.po.CompanyPO;

@Repository("constructionCameraMediaDao")
public class ConstructionCameraMediaDaoImpl extends DaoImpl<ConstructionCameraMediaPO> implements ConstructionCameraMediaDao {

	public ConstructionCameraMediaDaoImpl() {
		super(ConstructionCameraMediaPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructionCameraMediaPO> queryConstructionCameraMedia(String orderId, Long cameraId, Timestamp startTime, Timestamp endTime, Long csid, Short source, Short visible, int company) {

		Criteria query = createCriteria().add(Restrictions.eq(ConstructionCameraMediaPO.COLUMN_STATUS_STR, ConstructionCameraMediaPO.STATUS_ENABLE_INT));

		if (company != CompanyPO.TYPE_HEADQUARTER_INT) query.add(Restrictions.eq("company", company));

		if (orderId != null) query.add(Restrictions.eq(ConstructionCameraMediaPO.COLUMN_ORDERID_STR, orderId));

		if (cameraId != null) query.add(Restrictions.eq(ConstructionCameraMediaPO.COLUMN_CAMERAID_STR, cameraId));
		if (startTime != null) query.add(Restrictions.ge(ConstructionCameraMediaPO.COLUMN_CAPTURETIME_STR, startTime));
		if (endTime != null) query.add(Restrictions.le(ConstructionCameraMediaPO.COLUMN_CAPTURETIME_STR, endTime));
		if (csid != null) query.add(Restrictions.eq("csid", csid));
		if (source != null) query.add(Restrictions.eq("source", source));
		if (visible != null) query.add(Restrictions.eq(ConstructionCameraMediaPO.COLUMN_VISIBLE_STR, visible));

		return query.addOrder(Order.asc(ConstructionCameraMediaPO.COLUMN_CAPTURETIME_STR)).list();
	}

}
