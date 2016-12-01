/**
 * @File Name		: SupplierDaoImpl.java
 * @Package   	: com.fanglin.data.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-9-22
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.SupplierDao;
import com.fanglin.data.po.SupplierPO;
import com.fanglin.utils.Paging;

@Repository("supplierDao")
public class SupplierDaoImpl extends DaoImpl<SupplierPO> implements SupplierDao {
	
	public SupplierDaoImpl(){
		super(SupplierPO.class);
	}

	@Override
	public List<SupplierPO> pageSupplier(Paging paging, List<Filter> filters) {
		
		PagingQuery<SupplierPO> query = pagingQuery(paging, SupplierPO.class);
		
		queryFilterExecute(query, filters);
		
		return query.list();
	}

	@Override
	public SupplierPO querySupplierBySId(long sId) {
		return (SupplierPO) session().createCriteria(SupplierPO.class).add(Restrictions.eq(SupplierPO.COLUMN_SID_STR, sId)).uniqueResult();
	}
	
	@Override
	public SupplierPO querySupplierByLoginId(String loginId) {
		return (SupplierPO) session().createCriteria(SupplierPO.class).add(Restrictions.eq(SupplierPO.COLUMN_LOGINID_STR, loginId)).uniqueResult();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters){
		
		if(filters != null){
			for(Filter filter: filters){
				
				String field = filter.getField();
				
				if(SupplierPO.COLUMN_NAME_STR.equals(field)){
					query.add(query.getCriterion(SupplierPO.COLUMN_NAME_STR, filter.getData(), filter.getOp()));
				}
			}
		}
	}

}
