// Tarefa do Wesley: Parsing e Formatação do Protocolo GBTP

export interface GBTPRequest {
    operation: string;
    accountId: string;
    toAccountId: string;
    value: string;
}

export interface GBTPResponse {
    status: string;
    message: string;
    balance: string;
}

// Formata os dados do formulário para o padrão textual GBTP (com \n)
export function formatGBTPRequest(request: GBTPRequest): string {
    return `OPERATION:${request.operation}\n` +
           `ACCOUNT_ID:${request.accountId}\n` +
           `TO_ACCOUNT_ID:${request.toAccountId}\n` +
           `VALUE:${request.value}`;
}

// Faz o parse da resposta de texto que veio do servidor
export function parseGBTPResponse(responseString: string): GBTPResponse {
    const lines = responseString.split('\n');
    const response: any = {};

    lines.forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key) {
            response[key.trim()] = valueParts.join(':').trim();
        }
    });

    return {
        status: response['STATUS'] || 'ERROR',
        message: response['MESSAGE'] || 'Erro ao processar mensagem',
        balance: response['BALANCE'] || '0.00'
    };
}
