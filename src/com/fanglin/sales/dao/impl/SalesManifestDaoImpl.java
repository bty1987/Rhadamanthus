package com.fanglin.sales.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.sales.dao.SalesManifestDao;
import com.fanglin.sales.po.SalesManifestPO;

@Repository("salesManifestDao")
public class SalesManifestDaoImpl extends DaoImpl<SalesManifestPO> implements SalesManifestDao {

	public SalesManifestDaoImpl(){
		super(SalesManifestPO.class);
	}
	
}
