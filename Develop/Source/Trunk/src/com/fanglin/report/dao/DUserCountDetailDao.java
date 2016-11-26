/**
 * @File Name		: DUserCountDetailDao.java
 * @Package   	: com.fanglin.report.dao
 * @Version		: 1.0
 * @Date			: 2016-11-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.dao;

import java.text.ParseException;
import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.report.po.DUserCountDetailPO;

public interface DUserCountDetailDao extends Dao<DUserCountDetailPO> {
	
	public List<DUserCountDetailPO> queryDUserCountDetail(List<FilterVO> filters) throws ParseException;
	
}
