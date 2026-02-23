package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.DecorationAtttypePO;
import com.fanglin.utils.Paging;

public interface DecorationAtttypeDao extends Dao<DecorationAtttypePO> {

	public List<DecorationAtttypePO> pageDecorationAtttype(Paging paging, List<Filter> filters, int company);

	public List<DecorationAtttypePO> queryDecorationAtttype(int company);

	public DecorationAtttypePO queryDecorationAtttype(short type, int company);
}
