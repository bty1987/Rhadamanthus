/**
 * @File Name		: DecorationBackVisitDaoImpl
 * @Package   	: com.fanglin.decoration.dao.impl
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  bty1987
 * @Email			:
 * @Describing	:
 */

package com.fanglin.decoration.dao.impl;

import java.sql.Timestamp;
import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationBackVisitDao;
import com.fanglin.decoration.po.DecorationBackVisitPO;
import com.fanglin.utils.Paging;

@Repository("decorationBackVisitDao")
public class DecorationBackVisitDaoImpl extends DaoImpl<DecorationBackVisitPO> implements DecorationBackVisitDao {

	public DecorationBackVisitDaoImpl(){
		super(DecorationBackVisitPO.class);
	}

	@Override
	public List<DecorationBackVisitPO> pageDecorationBackVisitByOrderId(Paging paging, List<Filter> filters, String orderId){
		PagingQuery<DecorationBackVisitPO> query = pagingQuery(paging, DecorationBackVisitPO.class);

		if(!"".equals(orderId)){
			query.add(query.getCriterion("decoration.orderId", orderId, "eq"));
		}

		query.desc(DecorationBackVisitPO.COLUMN_CREATETIME_STR);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationBackVisitPO> queryDecorationBackVisitByOrderId(String orderId) {

		return session().createCriteria(DecorationBackVisitPO.class).createAlias("decoration", "decoration").add(Restrictions.eq(DecorationBackVisitPO.COLUMN_ORDERID_STR, orderId)).addOrder(Order.desc(DecorationBackVisitPO.COLUMN_CREATETIME_STR)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationBackVisitPO> queryDecorationBackVisitByOrderIdAStartAEndTime(String orderId,Timestamp start, Timestamp end){
		return createCriteria(DecorationBackVisitPO.class).createAlias("decoration", "decoration")
				.add(Restrictions.eq("decoration.orderId", orderId))
				.add(Restrictions.gt("createTime", start))
				.add(Restrictions.lt("createTime", end))
				.list();
	}

}
