/**
 * @File Name		: VenderPostBalanceDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.salary
 * @Version		: 1.0
 * @Date			: 2014-11-14
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.salary.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.salary.dao.VenderPostBalanceDao;
import com.fanglin.salary.po.VenderPostBalancePO;
import com.fanglin.utils.Paging;

@Repository("venderPostBalanceDao")
public class VenderPostBalanceDaoImpl extends DaoImpl<VenderPostBalancePO> implements VenderPostBalanceDao {
	
	public VenderPostBalanceDaoImpl(){
		super(VenderPostBalancePO.class);
	}
	
	@Override
	public List<VenderPostBalancePO> pageVenderPostBalance(Paging paging, List<FilterVO> filters) {
		
		PagingQuery<VenderPostBalancePO> query = pagingQuery(paging, VenderPostBalancePO.class);
		
		if(filters != null){
			for(FilterVO filter: filters){
				query.add(query.getCriterion(filter.getField(), filter));
			}
		}
		
		return query.list();
	}

	@Override
	public List<VenderPostBalancePO> pageVenderPostBalanceByMsoId(Paging paging, List<FilterVO> filters, long msoId) {
		
		PagingQuery<VenderPostBalancePO> query = pagingQuery(paging, VenderPostBalancePO.class);
		
		query.add(Restrictions.eq(VenderPostBalancePO.COLUMN_MSOID_STR, msoId));
		
		if(filters != null){
			for(FilterVO filter: filters){
				query.add(query.getCriterion(filter.getField(), filter));
			}
		}
		
		return query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<VenderPostBalancePO> queryVenderPostBalanceByVbId(int vbId) {
		return session().createCriteria(VenderPostBalancePO.class).add(Restrictions.eq(VenderPostBalancePO.COLUMN_VBID_STR, vbId)).list();
	}

}
