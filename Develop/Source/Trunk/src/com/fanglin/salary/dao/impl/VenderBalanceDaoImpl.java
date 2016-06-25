/**
 * @File Name		: VenderBalanceDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.salary
 * @Version		: 1.0
 * @Date			: 2014-11-14
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.salary.dao.impl;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.salary.dao.VenderBalanceDao;
import com.fanglin.salary.po.VenderBalancePO;
import com.fanglin.utils.Paging;

@Repository("venderBalanceDao")
public class VenderBalanceDaoImpl extends DaoImpl<VenderBalancePO> implements VenderBalanceDao {
	
	public VenderBalanceDaoImpl(){
		super(VenderBalancePO.class);
	}
	
	@Override
	public List<VenderBalancePO> pageVenderBalance(Paging paging, List<FilterVO> filters, Integer status) {
		
		PagingQuery<VenderBalancePO> query = pagingQuery(paging, VenderBalancePO.class);
		
		query.add(query.getCriterion(VenderBalancePO.COLUMN_MATERIALBRANDNAME_STR, "", "ne"));
		
		if(status != null){
			query.add(query.getCriterion(VenderBalancePO.COLUMN_STATUS_STR, status, "eq"));
		}
		
		if(filters != null){
			for(FilterVO filter: filters){
				query.add(query.getCriterion(filter.getField(), filter));
			}
		}else{
			return new ArrayList<VenderBalancePO>();
		}
		
		return query.list();
	}

	@Override
	public VenderBalancePO queryVenderBalanceByMaterialBrandIdInit(int materialBrandId) {
		return (VenderBalancePO) session().createCriteria(VenderBalancePO.class)
				.add(Restrictions.eq(VenderBalancePO.COLUMN_MATERIALBRANDID_STR, materialBrandId))
				.add(Restrictions.eq(VenderBalancePO.COLUMN_STATUS_STR, VenderBalancePO.STATUS_TYPE_INIT_INT))
				.uniqueResult();
	}

	@Override
	public VenderBalancePO queryVenderBalanceByMaterialBrandNameInit(String materialBrandName) {
		return (VenderBalancePO) session().createCriteria(VenderBalancePO.class)
				.add(Restrictions.eq(VenderBalancePO.COLUMN_MATERIALBRANDNAME_STR, materialBrandName))
				.add(Restrictions.eq(VenderBalancePO.COLUMN_STATUS_STR, VenderBalancePO.STATUS_TYPE_INIT_INT))
				.uniqueResult();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<VenderBalancePO> queryVenderBalanceByMaterialBrandId(int materialBrandId) {
		return session().createCriteria(VenderBalancePO.class).add(Restrictions.eq(VenderBalancePO.COLUMN_MATERIALBRANDID_STR, materialBrandId)).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<VenderBalancePO> queryVenderBalanceByInit() {
		return session().createCriteria(VenderBalancePO.class)
				.add(Restrictions.ne(VenderBalancePO.COLUMN_MATERIALBRANDNAME_STR, ""))
				.add(Restrictions.eq(VenderBalancePO.COLUMN_STATUS_STR, VenderBalancePO.STATUS_TYPE_INIT_INT))
				.list();
	}

}
