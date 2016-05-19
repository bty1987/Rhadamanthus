/**
 * @File Name		: MaterialOutsidePaymentDaoImpl.java
 * @Package   	: com.fanglin.material.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-10-30
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
import com.fanglin.payment.dao.MaterialOutsidePaymentDao;
import com.fanglin.payment.po.MaterialOutsidePaymentPO;
import com.fanglin.utils.Paging;

@Repository("materialOutsidePaymentDao")
public class MaterialOutsidePaymentDaoImpl extends DaoImpl<MaterialOutsidePaymentPO> implements MaterialOutsidePaymentDao {

	public MaterialOutsidePaymentDaoImpl(){
		super(MaterialOutsidePaymentPO.class);
	}

	@Override
	public List<MaterialOutsidePaymentPO> pageMaterialOutsidePayment(Paging paging, List<FilterVO> filters) {
		
		PagingQuery<MaterialOutsidePaymentPO> query = pagingQuery(paging, MaterialOutsidePaymentPO.class);
		
		if(filters != null){
			for(FilterVO filter: filters){
				query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
			}
		}
		
		return query.list();
	}

	@Override
	public List<MaterialOutsidePaymentPO> pageMaterialOutsidePaymentByInit(Paging paging, List<FilterVO> filters) {
		
		PagingQuery<MaterialOutsidePaymentPO> query = pagingQuery(paging, MaterialOutsidePaymentPO.class);
		
		query.add(Restrictions.eq(MaterialOutsidePaymentPO.COLUMN_PAYMENTSTATUS_STR, MaterialOutsidePaymentPO.PAYMENTSTATUS_INTI_INT));
		
		if(filters != null){
			for(FilterVO filter: filters){
				query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
			}
		}
		
		return query.list();
	}

	@Override
	public List<MaterialOutsidePaymentPO> pageMaterialOutsidePaymentByNotInit(Paging paging, List<FilterVO> filters) {
		
		PagingQuery<MaterialOutsidePaymentPO> query = pagingQuery(paging, MaterialOutsidePaymentPO.class);
		
		query.add(Restrictions.ne(MaterialOutsidePaymentPO.COLUMN_PAYMENTSTATUS_STR, MaterialOutsidePaymentPO.PAYMENTSTATUS_INTI_INT));
		
		if(filters != null){
			for(FilterVO filter: filters){
				query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
			}
		}
		
		return query.list();
	}

	@Override
	public MaterialOutsidePaymentPO queryMaterialOutsidePaymentByMoId(long moId) {
		return (MaterialOutsidePaymentPO) session().createCriteria(MaterialOutsidePaymentPO.class).add(Restrictions.eq(MaterialOutsidePaymentPO.COLUMN_MOID_STR, moId)).uniqueResult();
	}
	
}
