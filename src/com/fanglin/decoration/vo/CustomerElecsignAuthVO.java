package com.fanglin.decoration.vo;

import java.io.Serializable;

/**
 * 客户电子签认证状态VO(合同页判断客户认证状态用)
 *
 * <p>一个客户每个厂商一条: provider=1法大大/2e签宝, status取自elecsignauth
 * (null=未注册, 0=已注册未实名, 1=已实名, 2=已签署)
 */
public class CustomerElecsignAuthVO implements Serializable {

	private static final long serialVersionUID = 621007010000002L;

	private short provider;// 电子签厂商(1法大大/2e签宝)

	private Short status;// null=未注册, 0=已注册未实名, 1=已实名, 2=已签署

	public short getProvider() {
		return provider;
	}

	public void setProvider(short provider) {
		this.provider = provider;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}
}
