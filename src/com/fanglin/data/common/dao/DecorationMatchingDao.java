package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.DecorationMatchingPO;

public interface DecorationMatchingDao  extends Dao<DecorationMatchingPO> {

	public List<DecorationMatchingPO> queryDecorationMatching(List<Short> type, List<Short> typeness, int company);
	
}
