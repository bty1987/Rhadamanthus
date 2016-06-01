/**
 * @File Name		: BackVisitDaoImpl
 * @Package   	: com.fanglin.dao
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
import com.fanglin.core.vo.FilterVO;
import com.fanglin.decoration.dao.BackVisitDao;
import com.fanglin.decoration.po.BackVisitPO;
import com.fanglin.utils.Paging;

@Repository("backVisitDao")
public class BackVisitDaoImpl extends DaoImpl<BackVisitPO> implements BackVisitDao {

	public BackVisitDaoImpl(){
		super(BackVisitPO.class);
	}
	
	@Override
	public List<BackVisitPO> pageBackVisitByOrderId(Paging paging, List<FilterVO> filters, String orderId){
		PagingQuery<BackVisitPO> query = pagingQuery(paging, BackVisitPO.class);
		
		if(!"".equals(orderId)){
			query.add(query.getCriterion("decorationOrder.orderId", orderId, "eq"));
		}

		query.desc(BackVisitPO.COLUMN_CREATETIME_STR);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BackVisitPO> queryBackVisitByOrderId(String orderId) {
		return session().createCriteria(BackVisitPO.class).createAlias("decorationOrder", "decorationOrder").add(Restrictions.eq(BackVisitPO.COLUMN_ORDERID_STR, orderId)).addOrder(Order.desc(BackVisitPO.COLUMN_CREATETIME_STR)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BackVisitPO> queryBackVisitByOrderIdAStartAEndTime(String orderId,Timestamp start, Timestamp end){
		return createCriteria(BackVisitPO.class).createAlias("decorationOrder", "decorationOrder")
				.add(Restrictions.eq("decorationOrder.orderId", orderId))
				.add(Restrictions.gt("createTime", start))
				.add(Restrictions.lt("createTime", end))
				.list();
	}

}
