/**
 * @File Name		: CppointRecordDao.java
 * @Package   	: com.fanglin.communion.dao
 * @Version		: 1.0
 * @Date			: 2020-9-20
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.CppointRecordPO;
import com.fanglin.utils.Paging;

public interface CppointRecordDao extends Dao<CppointRecordPO> {

	public List<CppointRecordPO> queryCppointRecord(Long cpid, Paging paging, List<Filter> filters);

}
