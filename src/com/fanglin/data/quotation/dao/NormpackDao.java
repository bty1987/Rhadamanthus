package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.NormpackPO;
import com.fanglin.utils.Paging;

public interface NormpackDao extends Dao<NormpackPO> {

	public List<NormpackPO> pageNormpack(Paging paging, List<Filter> filters, Integer company);

	public List<NormpackPO> queryNormpack(int company);

}
