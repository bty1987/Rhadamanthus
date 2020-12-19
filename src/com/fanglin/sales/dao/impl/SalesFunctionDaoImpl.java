package com.fanglin.sales.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.sales.dao.SalesFunctionDao;
import com.fanglin.sales.po.SalesFunctionPO;

@Repository("salesFunctionDao")
public class SalesFunctionDaoImpl extends DaoImpl<SalesFunctionPO>  implements SalesFunctionDao{

	public SalesFunctionDaoImpl(){
		super(SalesFunctionPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<SalesFunctionPO> querySalesFunction(Short type) {
		if(type != null){
			return session().createCriteria(SalesFunctionPO.class).add(Restrictions.eq("type", type)).list();
		}else{
			return session().createCriteria(SalesFunctionPO.class).list();
		}
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SalesFunctionPO> querySalesFunctionByName(String name) {
		return session().createCriteria(SalesFunctionPO.class).add(Restrictions.eq("name", name)).list();
	}

}
