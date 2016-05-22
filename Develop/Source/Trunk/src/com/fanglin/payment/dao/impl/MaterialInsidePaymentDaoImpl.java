/**
 * @File Name		: MaterialInsidePaymentDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-11-18
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.payment.dao.MaterialInsidePaymentDao;
import com.fanglin.payment.po.MaterialInsidePaymentPO;
import com.fanglin.utils.Paging;

@Repository("materialInsidePaymentDao")
public class MaterialInsidePaymentDaoImpl extends DaoImpl<MaterialInsidePaymentPO> implements MaterialInsidePaymentDao {
	
	public MaterialInsidePaymentDaoImpl(){
		super(MaterialInsidePaymentPO.class);
	}
	
	@Override
	public List<MaterialInsidePaymentPO> pageMaterialInsidePayment(Paging paging, List<FilterVO> filters){
		
		PagingQuery<MaterialInsidePaymentPO> query = pagingQuery(paging, MaterialInsidePaymentPO.class);
		
		if(filters != null){
			for(FilterVO filter: filters){
				query.add(query.getCriterion(filter));
			}
		}
		
		return query.list();
	}
	
	@Override
	public List<MaterialInsidePaymentPO> pageMaterialInsidePaymentByInit(Paging paging, List<FilterVO> filters){
		
		PagingQuery<MaterialInsidePaymentPO> query = pagingQuery(paging, MaterialInsidePaymentPO.class);
		
		query.add(Restrictions.eq(MaterialInsidePaymentPO.COLUMN_PAYMENTSTATUS_STR, MaterialInsidePaymentPO.PAYMENTSTATUS_TYPE_INIT_INT));
		
		if(filters != null){
			for(FilterVO filter: filters){
				query.add(query.getCriterion(filter.getField(), filter));
			}
		}
		
		return query.list();
	}

	@Override
	public List<MaterialInsidePaymentPO> pageMaterialInsidePaymentByNotInit(Paging paging, List<FilterVO> filters){
		
		PagingQuery<MaterialInsidePaymentPO> query = pagingQuery(paging, MaterialInsidePaymentPO.class);
		
		query.add(Restrictions.ne(MaterialInsidePaymentPO.COLUMN_PAYMENTSTATUS_STR, MaterialInsidePaymentPO.PAYMENTSTATUS_TYPE_INIT_INT));
		
		if(filters != null){
			for(FilterVO filter: filters){
				query.add(query.getCriterion(filter.getField(), filter));
			}
		}
		
		return query.list();
	}

}
