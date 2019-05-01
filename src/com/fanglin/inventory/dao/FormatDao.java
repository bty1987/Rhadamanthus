package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.inventory.po.FormatPO;

public interface FormatDao extends Dao<FormatPO> {

	public List<FormatPO> queryFormatByGid(long gid);

	public List<FormatPO> queryFormatForEnableByGid(long gid);

	public FormatPO queryFormatByInfo(long gid, String info);

}
