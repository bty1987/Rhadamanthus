package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.FormatPoolPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface FormatPoolDao extends Dao<FormatPoolPO> {

	public List<FormatPoolPO> pageFormatPool(Paging paging, List<Filter> filters);

	public List<FormatPoolPO> queryFormatPoolByGpid(long gpid);

	public List<FormatPoolPO> queryFormatPoolForEnableByGpid(long gpid);

	public FormatPoolPO queryFormatPoolByInfo(long gpid, String info);

}
