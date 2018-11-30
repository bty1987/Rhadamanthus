package com.fanglin.market.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.market.po.CardPhotoPO;

public interface CardPhotoDao extends Dao<CardPhotoPO> {

	public List<CardPhotoPO> queryCardPhotoByCaid(long caid);

}
