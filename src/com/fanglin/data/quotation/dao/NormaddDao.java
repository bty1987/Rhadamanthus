package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.NormaddPO;
import com.fanglin.utils.Paging;

public interface NormaddDao extends Dao<NormaddPO> {

	public List<NormaddPO> pageNormadd(Paging paging, List<Filter> filters, int company);

	public List<NormaddPO> queryNormadd(Long cnid, int company);

}
