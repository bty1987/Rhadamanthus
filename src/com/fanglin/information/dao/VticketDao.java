package com.fanglin.information.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.po.VticketPO;
import com.fanglin.utils.Paging;

public interface VticketDao extends Dao<VticketPO> {

	public List<VticketPO> pageVticket(Paging paging, List<Filter> filters);

	public VticketPO queryVticketByTno(String tno);

	public List<?> countVticket(short param);

}
