package com.fanglin.camera.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.camera.dao.ConstructionCameraAccessDao;
import com.fanglin.camera.po.ConstructionCameraAccessPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("constructionCameraAccessDao")
public class ConstructionCameraAccessDaoImpl extends DaoImpl<ConstructionCameraAccessPO> implements ConstructionCameraAccessDao {

	public ConstructionCameraAccessDaoImpl() {
		super(ConstructionCameraAccessPO.class);
	}

}
