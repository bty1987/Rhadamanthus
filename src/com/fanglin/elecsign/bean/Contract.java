/**
 * @File Name		: Contract.java
 * @Package   	: com.fanglin.elecsign.bean
 * @Version		: 1.0
 * @Date			: 2019-11-4
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.elecsign.bean;

public interface Contract {

	public static final short STATUS_INIT_INT = 0;

	public static final short STATUS_FILING_INT = 1;

	public String download();

	public void download(String download);

	public String viewpdf();

	public void viewpdf(String viewpdf);

	public String templateCode();

	public String contentCode();

	public String title();

	public void status(short status);

	/**
	 * 厂商流程号（e签宝专用：upload/generate 后存 fileId，签署建流后覆盖为 signFlowId；
	 * 法大大不使用，恒为 null。需要持久化的合同 PO 实现之）。
	 */
	public String flowId();

	public void flowId(String flowId);

	/**
	 * 合同所属公司（e签宝实现用于读取该公司的厂商凭证；默认返回 0=全局凭证。
	 * 合同 PO 如有公司维度可覆写返回真实公司，e签宝实现即可支持公司级凭证）。
	 */
	public int company();

}
