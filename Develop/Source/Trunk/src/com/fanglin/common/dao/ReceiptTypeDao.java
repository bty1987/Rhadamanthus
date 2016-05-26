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

package com.fanglin.common.dao;

import java.util.List;

import com.fanglin.common.po.ReceiptTypePO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.utils.Paging;

public interface ReceiptTypeDao extends Dao<ReceiptTypePO> {
	
	public List<ReceiptTypePO> pageReceiptType(Paging paging, List<FilterVO> filters);
	
	public List<ReceiptTypePO> queryReceiptType();
	
	public List<ReceiptTypePO> queryReceiptTypeByType(short type);
	
	public ReceiptTypePO queryReceiptTypeByKey(String key);
	
}
