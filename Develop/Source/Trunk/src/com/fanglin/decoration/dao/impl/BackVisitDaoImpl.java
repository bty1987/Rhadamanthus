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
			query.add(query.getCriterion("decorationOrderPO.orderId", orderId, "eq"));
		}else{
			query.add(query.getCriterion("decorationOrderPO.orderId", "", "ne"));
		}

		if(filters != null){

			for(FilterVO filter : filters){
				if("grade".equals(filter.getField())){
					query.add(query.getCriterion("grade", Integer.parseInt(filter.getData()), filter.getOp()));
				}else{
					query.add(query.getCriterion("grade", -1, "ne"));
				}
			}
		}
		query.desc("createTime");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BackVisitPO> queryBackVisitByOrderIdAStartAEndTime(String orderId,Timestamp start, Timestamp end){
		return createCriteria(BackVisitPO.class)
				.add(Restrictions.eq("decorationOrderPO.orderId", orderId))
				.add(Restrictions.eq("grade", -1))
				.add(Restrictions.gt("createTime", start))
				.add(Restrictions.lt("createTime", end))
				.list();
	}

}
