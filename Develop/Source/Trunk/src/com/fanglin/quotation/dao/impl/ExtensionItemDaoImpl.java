package com.fanglin.quotation.dao.impl;


import java.util.List;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.ExtensionItemDao;
import com.fanglin.quotation.po.ExtensionItemPO;

@Repository("extensionItemDao")
public class ExtensionItemDaoImpl extends DaoImpl<ExtensionItemPO> implements ExtensionItemDao{

	
	public ExtensionItemDaoImpl(){
		super(ExtensionItemPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ExtensionItemPO> queryExtensionItemByEid(Long eId) {
		return session().createCriteria(ExtensionItemPO.class).add(Restrictions.eq(ExtensionItemPO.COLUMN_EID_STR, eId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ExtensionItemPO> queryExtensionItemByEids(List<Long> extensionItemIDs) {
		return session().createCriteria(ExtensionItemPO.class).add(Restrictions.in(ExtensionItemPO.COLUMN_EID_STR, extensionItemIDs)).list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<Integer> queryQuotationFunctionAreaIdByEids(List<Long> extensionItemIDs){
		String sql = "select distinct quotationFunctionAreaId from quotation.extensionitem where eId in :eId ";
		return session().createSQLQuery(sql).setParameterList("eId", extensionItemIDs).list();
	};
	
}
