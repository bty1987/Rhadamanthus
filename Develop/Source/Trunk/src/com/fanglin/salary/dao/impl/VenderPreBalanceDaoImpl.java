/**
 * @File Name		: VenderPreBalanceDaoImpl.java
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
import com.fanglin.salary.dao.VenderPreBalanceDao;
import com.fanglin.salary.po.VenderPreBalancePO;
import com.fanglin.utils.Paging;

@Repository("venderPreBalanceDao")
public class VenderPreBalanceDaoImpl extends DaoImpl<VenderPreBalancePO> implements VenderPreBalanceDao {
	
	public VenderPreBalanceDaoImpl(){
		super(VenderPreBalancePO.class);
	}

	@Override
	public List<VenderPreBalancePO> pageVenderPreBalance(Paging paging, List<FilterVO> filters) {
		
		PagingQuery<VenderPreBalancePO> query = pagingQuery(paging, VenderPreBalancePO.class);
		
		if(filters != null){
			for(FilterVO filter: filters){
				query.add(query.getCriterion(filter.getField(), filter));
			}
		}
		
		return query.list();
	}

	@Override
	public List<VenderPreBalancePO> pageVenderPreBalanceByMsoId(Paging paging, List<FilterVO> filters, long msoId) {
		
		PagingQuery<VenderPreBalancePO> query = pagingQuery(paging, VenderPreBalancePO.class);
		
		query.add(Restrictions.eq(VenderPreBalancePO.COLUMN_MSOID_STR, msoId));
		
		if(filters != null){
			for(FilterVO filter: filters){
				query.add(query.getCriterion(filter.getField(), filter));
			}
		}
		
		return query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<VenderPreBalancePO> queryVenderPreBalanceByVbId(int vbId) {
		return session().createCriteria(VenderPreBalancePO.class).add(Restrictions.eq(VenderPreBalancePO.COLUMN_VBID_STR, vbId)).list();
	}

}
