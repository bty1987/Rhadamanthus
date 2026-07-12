/**
 * @File Name		: Contract.java
 * @Package   	: com.fanglin.fadada.bean
 * @Version		: 1.0
 * @Date			: 2019-11-4
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 电子签合同数据契约（厂商中立）。
 *               使 ElecsignService 不再依赖 fadada 包。
 */

package com.fanglin.fadada.bean;

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

}
