package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.DecorationCirclePicturePO;

public interface DecorationCirclePictureDao extends Dao<DecorationCirclePicturePO>{
	
	public List<DecorationCirclePicturePO> queryDecorationCirclePictureByDcid(long dcid);

}
