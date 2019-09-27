package com.fanglin.payment.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.payment.po.PointofsalesPO;

public interface PointofsalesDao extends Dao<PointofsalesPO> {

	public List<PointofsalesPO> queryPointofsalesByPid(String pid, short type);

	public void updatePointofsales(List<Long> posids, Short status);

	public long countPointofsales(String sn, Short status);

}
