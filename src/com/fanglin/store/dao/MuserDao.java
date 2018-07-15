package com.fanglin.store.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.po.MuserPO;
import com.fanglin.utils.Paging;

public interface MuserDao extends Dao<MuserPO> {

	public List<MuserPO> pageMuser(Paging paging, List<Filter> filters);

	public MuserPO queryMuserByUnionId(String unionId);

}
