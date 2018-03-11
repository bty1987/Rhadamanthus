/**
 * @File Name		: ReceiptTypeDao.java
 * @Package   	: com.fanglin.common.dao
 * @Version		: 1.0
 * @Date			: 2016-5-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */
package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.ReceiptTypePO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ReceiptTypeDao extends Dao<ReceiptTypePO> {
	
	public List<ReceiptTypePO> pageReceiptType(Paging paging, List<Filter> filters,int company);
	
	public List<ReceiptTypePO> queryReceiptType(int company);
	
	public List<ReceiptTypePO> queryReceiptTypeByType(short type,int company);
	
	public ReceiptTypePO queryReceiptTypeByNo(String no,int company);
	
}
