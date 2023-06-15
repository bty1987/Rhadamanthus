package com.fanglin.decoration.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.DecorationPictureRecordDao;
import com.fanglin.decoration.po.DecorationPictureRecordPO;

@Repository("decorationPictureRecordDao")
public class DecorationPictureRecordDaoImpl extends DaoImpl<DecorationPictureRecordPO> implements DecorationPictureRecordDao {

	public DecorationPictureRecordDaoImpl() {
		super(DecorationPictureRecordPO.class);
	}

}
