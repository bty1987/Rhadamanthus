/**
 * @File Name		: ApprovalService.java
 * @Package   	: com.fanglin.approval.service
 * @Version		: 1.0
 * @Date			: 2015-10-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.service;

import java.util.List;

import com.fanglin.approval.vo.ProcessItemVO;
import com.fanglin.approval.vo.ProcessVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ProcessService {

	public void pageProcess(Paging paging, List<Filter> filters, int company);

	public List<ProcessVO> queryProcess();

	public ProcessVO queryProcessByPid(ProcessVO process);

	public List<ProcessItemVO> queryProcessItem(ProcessVO process);

	public void addProcess(ProcessVO process, List<ProcessItemVO> processItems, int company) throws FLException;

	public void updateProcess(ProcessVO process, List<ProcessItemVO> processItems) throws FLException;

	public void updateProcessForStatus(ProcessVO process) throws FLException;

	public void updateProcessItem(ProcessItemVO processItem);

	public void deleteProcess(ProcessVO process) throws FLException;

	public void deleteProcessItem(ProcessItemVO processItem) throws FLException;

}
