package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.NormtimePO;
import com.fanglin.utils.Paging;

public interface NormtimeDao extends Dao<NormtimePO> {

	public List<NormtimePO> pageNormtime(Paging paging, List<Filter> filters);

	public List<NormtimePO> queryNormtimeByQiid(Long qiid);

}
