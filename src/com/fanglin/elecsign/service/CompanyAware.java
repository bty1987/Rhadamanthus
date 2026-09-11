package com.fanglin.elecsign.service;

/**
 * 厂商实现的公司绑定能力。
 *
 * <p>{@code ElecsignService} 接口方法签名不带公司维度（历史平移自法大大静态方法），
 * 而 e签宝凭证是公司级配置（systemconfig 按 company 存取）。实现本接口的厂商实现，
 * 由 {@code ElecsignRouter.route(company, scene)} 返回 {@link #forCompany(int)} 生成的
 * 公司绑定实例，把路由时的公司上下文带进后续接口调用。
 *
 * <p>实现约束：forCompany 返回的实例非 Spring 管理（轻量绑定对象），线程安全。
 */
public interface CompanyAware {

	/**
	 * 返回绑定了公司上下文的实现（后续接口调用用该公司的厂商凭证）。
	 *
	 * @param company 公司 cid
	 * @return 公司绑定的 ElecsignService
	 */
	ElecsignService forCompany(int company);
}
