package com.fanglin.inventory.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.inventory.dao.AssisManifestDao;
import com.fanglin.inventory.po.AssisManifestPO;

@Repository("assisManifestDao")
public class AssisManifestDaoImpl extends DaoImpl<AssisManifestPO> implements AssisManifestDao {
	
	public AssisManifestDaoImpl(){
		super(AssisManifestPO.class);
	}
	
}
