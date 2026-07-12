/**
 * @File Name		: ApprovalFormDataService.java
 * @Package   		: com.fanglin.approval.service
 * @Version			: 1.0
 * @Description		: 审批表单填写数据存取服务。引擎提交/审批时调用,
 * 					  把前端的 fieldKey→fieldValue 映射存入 EAV 表,或反向组装成 Map 给业务层。
 */

package com.fanglin.approval.service;

import java.util.List;
import java.util.Map;

import com.fanglin.approval.vo.ApprovalFormDataVO;
import com.fanglin.core.interceptor.FLException;

public interface ApprovalFormDataService {

	/**
	 * 保存表单数据:把 fieldKey→fieldValue 映射转为 EAV 行存入。
	 * 需要先按 formId 查字段定义,把 fieldKey 转成 fieldId。
	 *
	 * @param aid       审批单ID
	 * @param formId    表单定义ID
	 * @param formData  fieldKey→fieldValue 映射
	 * @param taskId    关联任务(可选,提交时填传 null,审批时填传 taskId)
	 */
	public void saveFormData(long aid, long formId, Map<String, String> formData, Long taskId) throws FLException;

	/**
	 * 查询某审批单的表单数据,组装成 fieldKey→fieldValue 映射返回(供业务 Service 使用)。
	 */
	public Map<String, String> queryFormDataMap(long aid) throws FLException;

	/**
	 * 查询某审批单的表单数据列表(含字段标签,供前端展示审批详情)。
	 */
	public List<ApprovalFormDataVO> queryFormDataList(long aid) throws FLException;

}
