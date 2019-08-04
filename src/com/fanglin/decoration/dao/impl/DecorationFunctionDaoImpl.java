package com.fanglin.decoration.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.DecorationFunctionDao;
import com.fanglin.decoration.po.DecorationFunctionPO;

@Repository("decorationFunctionDao")
public class DecorationFunctionDaoImpl extends DaoImpl<DecorationFunctionPO> implements DecorationFunctionDao {

	public DecorationFunctionDaoImpl(){
		super(DecorationFunctionPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationFunctionPO> queryDecorationFunction(Short type) {
		
		if(type != null){
			return session().createCriteria(DecorationFunctionPO.class).add(Restrictions.eq("type", type)).list();
		}else{
			return session().createCriteria(DecorationFunctionPO.class).list();
		}
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationFunctionPO> queryDecorationFunctionByName(String name) {
		return session().createCriteria(DecorationFunctionPO.class).add(Restrictions.eq("name", name)).list();
	}

}
