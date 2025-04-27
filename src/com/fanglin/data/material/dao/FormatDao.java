package com.fanglin.data.material.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.FormatGO;
import com.fanglin.data.po.FormatPO;
import com.fanglin.utils.Paging;

public interface FormatDao extends Dao<FormatPO> {

	public List<FormatGO> pageFormat(Paging paging, List<Filter> filters, int company);

	public List<FormatPO> queryFormatByGid(long gid);

	public List<FormatPO> queryFormatForEnableByGid(long gid);

	public FormatPO queryFormatByInfo(long gid, String info);

	public int batchSaveFormat(long gid, long gpid);

}
