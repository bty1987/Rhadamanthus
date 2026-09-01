package com.fanglin.camera.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.camera.dao.ConstructionCameraDao;
import com.fanglin.camera.po.ConstructionCameraPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.Paging;

@Repository("constructionCameraDao")
public class ConstructionCameraDaoImpl extends DaoImpl<ConstructionCameraPO> implements ConstructionCameraDao {

	public ConstructionCameraDaoImpl() {
		super(ConstructionCameraPO.class);
	}

	@Override
	public List<ConstructionCameraPO> pageConstructionCamera(Paging paging, List<Filter> filters, int company) throws FLException {

		PagingQuery<ConstructionCameraPO> query = pagingQuery(paging, ConstructionCameraPO.class);

		query.add(Restrictions.eq(ConstructionCameraPO.COLUMN_STATUS_STR, ConstructionCameraPO.STATUS_ENABLE_INT));
		if (company != CompanyPO.TYPE_HEADQUARTER_INT) query.add(Restrictions.eq("company", company));

		queryFilterExcute(query, filters);

		query.desc(ConstructionCameraPO.COLUMN_CCID_STR);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructionCameraPO> queryConstructionCameraByOrderId(String orderId, int company) {
		Criteria query = createCriteria().add(Restrictions.eq(ConstructionCameraPO.COLUMN_ORDERID_STR, orderId)).add(Restrictions.eq(ConstructionCameraPO.COLUMN_STATUS_STR, ConstructionCameraPO.STATUS_ENABLE_INT));

		if (company != CompanyPO.TYPE_HEADQUARTER_INT) query.add(Restrictions.eq("company", company));

		return query.addOrder(Order.desc(ConstructionCameraPO.COLUMN_CCID_STR)).list();
	}

	@Override
	public ConstructionCameraPO queryConstructionCameraByCcid(long ccid, int company) {
		Criteria query = createCriteria().add(Restrictions.eq(ConstructionCameraPO.COLUMN_CCID_STR, ccid));

		if (company != CompanyPO.TYPE_HEADQUARTER_INT) query.add(Restrictions.eq("company", company));

		return (ConstructionCameraPO) query.setMaxResults(1).uniqueResult();
	}

	@Override
	public ConstructionCameraPO queryConstructionCameraByDevice(String provider, String deviceSerial, int channelNo, int company) {
		Criteria query = createCriteria().add(Restrictions.eq(ConstructionCameraPO.COLUMN_PROVIDER_STR, provider)).add(Restrictions.eq(ConstructionCameraPO.COLUMN_DEVICESERIAL_STR, deviceSerial)).add(Restrictions.eq("channelNo", channelNo));

		if (company != CompanyPO.TYPE_HEADQUARTER_INT) query.add(Restrictions.eq("company", company));

		return (ConstructionCameraPO) query.setMaxResults(1).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) throws FLException {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (ConstructionCameraPO.COLUMN_ORDERID_STR.equals(field)) {
				query.add(query.getCriterion(ConstructionCameraPO.COLUMN_ORDERID_STR, data, op));
			} else if (ConstructionCameraPO.COLUMN_DEVICESERIAL_STR.equals(field)) {
				query.add(Restrictions.ilike(ConstructionCameraPO.COLUMN_DEVICESERIAL_STR, data, MatchMode.ANYWHERE));
			} else if (ConstructionCameraPO.COLUMN_ONLINESTATUS_STR.equals(field)) {
				query.add(query.getCriterion(ConstructionCameraPO.COLUMN_ONLINESTATUS_STR, Short.valueOf(data), op));
			}
		}
	}

}
