package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.po.NormtionDO;
import com.fanglin.quotation.po.NormtionPO;
import com.fanglin.utils.Paging;

public interface NormtionDao extends Dao<NormtionPO> {

	public List<NormtionDO> pageNormtion(Paging paging, List<Filter> filters, Integer company);

	public NormtionPO queryNormtion(long qid);
}
