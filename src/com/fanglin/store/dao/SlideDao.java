package com.fanglin.store.dao;

import java.util.List;
import com.fanglin.core.dao.Dao;
import com.fanglin.store.po.SlidePO;

public interface SlideDao extends Dao<SlidePO> {
	
	public List<SlidePO> querySlide(Boolean flag);
	
}
