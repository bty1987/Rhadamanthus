package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.ConstantPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ConstantDao extends Dao<ConstantPO> {

	public List<ConstantPO> pageConstant(Paging paging, List<Filter> filters);

	public List<ConstantPO> queryConstant(String module, String clazz, String type);

	public ConstantPO queryConstant(String module, String clazz, String type, String key);
}
