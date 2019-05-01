/**
 * @File Name		: VawardDao.java
 * @Package   	: com.fanglin.information.dao
 * @Version		: 1.0
 * @Date			: 2019-4-28
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.information.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.information.po.VawardPO;

public interface VawardDao extends Dao<VawardPO> {
	
	public List<VawardPO> queryVawardByNo(String no);

}
