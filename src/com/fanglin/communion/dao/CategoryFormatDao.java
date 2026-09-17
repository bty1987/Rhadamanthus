package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.CategoryFormatPO;
import com.fanglin.core.dao.Dao;

public interface CategoryFormatDao extends Dao<CategoryFormatPO> {

	public List<CategoryFormatPO> queryCategoryFormatByCid(long cid);

	public CategoryFormatPO queryCategoryFormat(long cid, String format);

	public int deleteCategoryFormatByCid(long cid);

}
