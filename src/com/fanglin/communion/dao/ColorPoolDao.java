package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.ColorPoolPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ColorPoolDao extends Dao<ColorPoolPO> {

	public List<ColorPoolPO> pageColorPool(Paging paging, List<Filter> filters);

	public List<ColorPoolPO> queryColorPoolByGpid(long gpid);

	public List<ColorPoolPO> queryColorPoolForEnableByGpid(long gpid);

	public ColorPoolPO queryColorPoolByName(long gpid, String name);

}
