/**
 * @File Name		: DecorationContractService
 * @Package   	: com.fanglin.service.decorationOrder;
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.log.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.log.po.ActionLogPO;
import com.fanglin.log.vo.LogVO;
import com.fanglin.utils.Paging;

public interface LogService {
	
	public List<LogVO> getAllPageActionLogs(List<Filter> filters);

	public void pageActionLog(Paging paging, List<Filter> filters);
	
	public int addLog(LogVO logVO);
	
	public int addActionLog(ActionLogPO actionLogPO);
	
}
