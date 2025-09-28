package com.fanglin.balance.dao;

import java.util.List;

import com.fanglin.balance.po.BalancePicturePO;
import com.fanglin.core.dao.Dao;

public interface BalancePictureDao extends Dao<BalancePicturePO> {

	public List<BalancePicturePO> queryBalancePictureByBid(Long bid);

	public List<BalancePicturePO> queryBalancePictureByPid(Long pid);

	public int countBalancePicture(Long bid, short type);

}
