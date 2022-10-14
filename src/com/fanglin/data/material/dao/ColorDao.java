package com.fanglin.data.material.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.ColorGO;
import com.fanglin.data.po.ColorPO;
import com.fanglin.utils.Paging;

public interface ColorDao extends Dao<ColorPO> {

	public List<ColorGO> pageColor(Paging paging, List<Filter> filters, int company);

	public List<ColorPO> queryColorByGid(long gid);

	public List<ColorPO> queryColorForEnableByGid(long gid);

	public ColorPO queryColorByName(long gid, String name);

}
